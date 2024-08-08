import { ChangeEvent, useEffect, useState } from 'react';
import './tableStyle.css';
import axios from 'axios';

interface DivisionEl {
  name: { en: string };
  nr: number;
  code: number;
  company: { name: string };
  address: string | number;
  employeeCount: string | number;
}

interface CompanyEl {
  nr: string | number;
  name: string;
  description: string;
  employeeCount: string | number;
  logo: string | File;
}

interface EmployeesEl {
  avatar: string | File;
  name: string;
  surname: string;
  job: { name: { en: string } };
  company: { name: string };
  division: { name: { en: string } };
  department: { name: { en: string } };
}

const TableComponent = () => {
  const handleClick = () => {
    axios
      .get(
        clickedBtn == 'emp'
          ? 'https://test-dev.timix.org/api/v1/employees'
          : clickedBtn == 'div'
          ? 'https://test-dev.timix.org/api/v1/divisions'
          : clickedBtn == 'comp'
          ? 'https://test-dev.timix.org/api/v1/companies'
          : '',
        {
          params: { keyword: keywords },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) =>
        clickedBtn == 'emp'
          ? setEmployeesTablerow(res.data.data)
          : clickedBtn == 'div'
          ? setDivisionsTablerow(res.data.data)
          : clickedBtn == 'comp'
          ? setCompaniesTablerow(res.data.data)
          : ''
      );
  };

  const limit = 9;
  const [clickedBtn, setclickedBtn] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tableHead, settableHead] = useState<string[]>([]);
  const [DivisionstableRow, setDivisionsTablerow] = useState([]);
  const [companiestableRow, setCompaniesTablerow] = useState([]);
  const [EmployeestableRow, setEmployeesTablerow] = useState([]);
  const [offsetCompany, setOffsetCompany] = useState(0);
  const [offsetEmployee, setOffsetEmployee] = useState(0);
  const [offsetDivision, setOffsetDivision] = useState(0);

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsInV1aWQiOiI5OWQ5N2UxMC0yOWUzLTRiN2QtYjQwZS0yMmFmMDlhYzM1ZDMiLCJkZXBJZCI6MywiZGl2SWQiOjgsImNvbXBJZCI6MSwibmFtZSI6Ikt5w71hcyIsInN1cm5hbWUiOiJJbG15cmFkb3ciLCJsYW5nIjoidGsiLCJhY2Nlc3NlcyI6W10sImlhdCI6MTcyMzEwMjYxNCwiZXhwIjoxNzIzMTA5ODE0fQ.MGKxw1Q4yhBnVzuboJWqXARrMazgnQN19mUxlb5nIE8';

  const handleCompanybtn = () => {
    setclickedBtn('comp');
    settableHead(['#', 'Logo', 'Name & Description', 'Employee number']);
    console.log(clickedBtn);
  };
  const handleEmployeebtn = () => {
    setclickedBtn('emp');
    settableHead([
      'Image',
      'Name/surname',
      'Job',
      'Company name',
      'Division name',
      'Department name',
    ]);
    console.log(clickedBtn);
  };
  const handleDivisionbtn = () => {
    setclickedBtn('div');
    settableHead([
      'Name',
      'ERP code',
      'Code',
      'Company name',
      'address',
      'Employee number',
    ]);
  };
  // !------------------------------------------------------------------------------------- useEffect
  useEffect(() => {
    axios
      .get('https://test-dev.timix.org/api/v1/divisions', {
        params: { limit, offset: offsetDivision },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>
        setDivisionsTablerow((prevDate) => [...prevDate, ...res.data.data])
      );
  }, [offsetDivision]);

  useEffect(() => {
    axios
      .get('https://test-dev.timix.org/api/v1/employees', {
        params: { limit, offset: offsetEmployee },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>
        setEmployeesTablerow((prevDate) => [...prevDate, ...res.data.data])
      );
  }, [offsetEmployee]);

  useEffect(() => {
    axios
      .get('https://test-dev.timix.org/api/v1/companies', {
        params: { limit, offset: offsetCompany },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>
        setCompaniesTablerow((prevDate) => [...prevDate, ...res.data.data])
      );
  }, [offsetCompany]);

  // !--------------------------------------------------------------------------------------------
  const handleScrollery = () => {
    console.log('hello');

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      console.log('bye');

      clickedBtn == 'div'
        ? setOffsetDivision((prev) => prev + 20)
        : clickedBtn == 'emp'
        ? setOffsetEmployee((prev) => prev + 20)
        : clickedBtn == 'comp'
        ? setOffsetCompany((prev) => prev + 20)
        : '';
      console.log(offsetEmployee, clickedBtn);
    }
  };

  window.addEventListener('scroll', handleScrollery);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setKeywords(e.target.value);
  }

  return (
    <div>
      <div>
        <button onClick={handleCompanybtn}>Company</button>
        <button onClick={handleEmployeebtn}>Employees</button>
        <button onClick={handleDivisionbtn}>Divisions</button>
      </div>
      <div>
        <input
          value={keywords}
          type="text"
          onChange={handleChange}
        />
        <button onClick={handleClick}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            {tableHead.map((el, i) => {
              return (
                <th
                  key={i}
                  className="text-dark"
                >
                  {el}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {clickedBtn == 'div'
            ? DivisionstableRow.map((el: DivisionEl, i) => {
                return (
                  <tr key={i}>
                    <td>{el.name.en}</td>
                    <td>{el.nr}</td>
                    <td>{el.code}</td>
                    <td>{el.company.name}</td>
                    <td>{el.address}</td>
                    <td>{el.employeeCount}</td>
                  </tr>
                );
              })
            : clickedBtn == 'emp'
            ? EmployeestableRow.map((el: EmployeesEl, i) => {
                return (
                  <tr key={i}>
                    <td style={{ width: '80px' }}>
                      <img
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '5px',
                        }}
                        src={`https://test-dev.timix.org/api/employee/500_${el.avatar}`}
                      />
                    </td>
                    <td>{el.name + ' ' + el.surname}</td>
                    <td>{el.job?.name?.en}</td>
                    <td>{el.company.name}</td>
                    <td>{el.division.name.en}</td>
                    <td>{el.department?.name?.en}</td>
                  </tr>
                );
              })
            : clickedBtn == 'comp'
            ? companiestableRow.map((el: CompanyEl, i) => {
                return (
                  <tr key={i}>
                    <td>{el.nr}</td>
                    <td style={{ width: '48px' }}>
                      <img
                        src={`https://test-dev.timix.org/api/company/100_${el.logo}`}
                        alt=""
                      />
                    </td>
                    <td>
                      <div>
                        <p>{el.name}</p>
                        <p>{el.description}</p>
                      </div>
                    </td>
                    <td>{el.employeeCount}</td>
                  </tr>
                );
              })
            : ''}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
