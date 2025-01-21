import React, { useEffect, useState } from "react";
import "./App.css";
import { PieChart, Pie, Cell } from "recharts";
import { data } from "./Data";

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const [pages, setPages] = useState(
    data.map((panel) => ({
      ...panel,
      rows: panel.rows.map((row) => ({
        ...row,
        checked: row.checked === false ? 0 : 1,
      })),
    }))
  );

  return (
    <div className="App" style={styles.appContainer}>
      <div
        style={{
          width: "63%",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "2%",
          margin: "0 auto 25px auto",
        }}
      >
        <ChartGeral pages={pages} />
        <Chart pages={pages} currentPage={currentPage} />
      </div>
      <div style={styles.tableContainer}>
        <div style={styles.titleCell}>
          <p>PROVA DE CONCEITO DE PAINÉIS GERENCIAIS - BI</p>
        </div>
        <Row
          id="ID"
          description="DESCRIÇÃO DO REQUISITO"
          header={true}
          pages={pages}
          setPages={setPages}
          currentPage={currentPage}
        />
        <div style={styles.titleCell}>
          <p>{pages[currentPage].title}</p>
        </div>
        {pages[currentPage].rows.map((item, key) => (
          <Row
            id={item?.id}
            description={item.name}
            pages={pages}
            setPages={setPages}
            currentPage={currentPage}
            key={key}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <img
          src="./arrow.svg"
          style={{ transform: "scaleX(-1)", cursor: "pointer" }}
          onClick={() => setCurrentPage(currentPage > 0 ? currentPage - 1 : 0)}
        />
        <img
          src="./arrow.svg"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setCurrentPage(
              currentPage < pages.length - 1
                ? currentPage + 1
                : pages.length - 1
            )
          }
        />
      </div>
    </div>
  );
}

const Row = ({ id, description, header, pages, setPages, currentPage }) => {
  return (
    <div style={styles.rowContainer}>
      <div
        style={{
          ...styles.cell,
          width: "5%",
          height: header ? "100px" : "50px",
        }}
      >
        <p>{id}</p>
      </div>
      <div
        style={{
          ...styles.cell,
          flex: 1,
          border: "none",
          height: header ? "100px" : "50px",
          justifyContent: header ? "center" : "flex-start",
        }}
      >
        <p style={{ textAlign: "left", paddingLeft: !header ? "10px" : "0px" }}>
          {description}
        </p>
      </div>
      {header ? (
        <div style={styles.headerRightContainer}>
          <div style={{ ...styles.headerCell, borderTop: "none" }}>
            ITEM ATENDIDO
          </div>
          <div style={styles.headerSubContainer}>
            <div style={{ ...styles.headerSubCell, borderRight: "none" }}>
              SIM
            </div>
            <div style={styles.headerSubCell}>NÃO</div>
          </div>
        </div>
      ) : (
        <div style={styles.rowRightContainer}>
          <div
            style={{
              ...styles.rowCell,
              borderRight: "none",
              ...styles.cellButton,
            }}
            onClick={() =>
              setPages((prevPages) =>
                prevPages.map((page) => {
                  if (page.title === pages[currentPage].title) {
                    console.log(pages[currentPage].title);
                    return {
                      ...page,
                      rows: page.rows.map((item) => {
                        if (item?.id === id) {
                          return {
                            ...item,
                            checked: item.checked === 0 ? 1 : 0,
                          };
                        } else {
                          return item;
                        }
                      }),
                    };
                  } else {
                    return page;
                  }
                })
              )
            }
          >
            {pages[currentPage].rows.find((item) => item?.id === id).checked ===
              1 && <img src={"./check.svg"} alt="checked" />}
          </div>
          <div style={{ ...styles.rowCell, ...styles.cellButton }}></div>
        </div>
      )}
      <div
        style={{
          ...styles.cell,
          width: "25%",
          borderRight: "none",
          height: header ? "100px" : "50px",
        }}
      >
        <p>{header ? "Número do item na documentação da Solução" : ""}</p>
      </div>
    </div>
  );
};

const Chart = ({ pages, currentPage }) => {
  const data = pages[currentPage].rows;

  const COLORS = [
    "#2bb393",
    "#35bd9d",
    "#3fc4a5",
    "#47ccad",
    "#4ed4b5",
    "#59debf",
    "#62e3c5",
    "#6cebcd",
    "#75f0d3",
    "#7ef2d7",
    "#88f7dd",
    "#92fce4",
  ];

  return (
    <div style={styles.chartContainer}>
      <PieChart width={400} height={275}>
        <Pie
          dataKey="checked"
          startAngle={180}
          endAngle={
            180 -
            data.reduce(
              (acc, item) => acc + (item.checked === 1 ? 180 / data.length : 0),
              0
            )
          }
          data={data}
          cx="50%"
          cy="75%"
          outerRadius={150}
          fill="#8884d8"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <p style={{ width: "50%" }}>
        <strong>Requisitos:</strong>{" "}
        {pages[currentPage].title[0] +
          pages[currentPage].title.toLocaleLowerCase().slice(1)}
      </p>
      <p
        style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          fontSize: "18px",
        }}
      >
        Concluídos: {data.filter((item) => item.checked === 1).length} / {""}
        {data.length}
      </p>
    </div>
  );
};

const ChartGeral = ({ pages }) => {
  const allRowsObjects = pages.reduce((acc, page) => {
    return acc.concat(
      page.rows.map((item) => ({
        ...item,
        checked: item.checked === 0 ? 1 : 2,
      }))
    );
  }, []);

  const COLORS = ["#84c6cf", "#90a2a6"];

  return (
    <div style={styles.chartContainer}>
      <PieChart width={400} height={275}>
        <Pie
          data={allRowsObjects}
          cx={200}
          cy={125}
          innerRadius={90}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={1}
          dataKey="checked"
        >
          {allRowsObjects.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.checked === 2 ? COLORS[0] : COLORS[1]}
            />
          ))}
        </Pie>
      </PieChart>
      <p style={{ width: "20%" }}>
        Requisitos<strong> totais</strong> concluídos
      </p>
      <p
        style={{
          position: "absolute",
          textAlign: "center",
          left: "31%",
          top: "40%",
          fontSize: "18px",
        }}
      >
        Total: {allRowsObjects.filter((item) => item.checked === 2).length} /{" "}
        {allRowsObjects.length} <br />
        {(
          (allRowsObjects.filter((item) => item.checked === 2).length /
            allRowsObjects.length) *
          100
        ).toFixed(2)}
        %
      </p>
    </div>
  );
};

const styles = {
  appContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "10px",
  },
  tableContainer: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: "25px",
  },
  rowContainer: {
    width: "100%",
    border: "1px solid black",
    display: "flex",
  },
  cell: {
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRight: "1px solid black",
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "column",
    width: "20%",
  },
  headerCell: {
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid black",
  },
  headerSubContainer: {
    display: "flex",
    flexDirection: "row",
  },
  headerSubCell: {
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
  },
  rowRightContainer: {
    display: "flex",
    flexDirection: "row",
    width: "20%",
  },
  rowCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
    width: "50%",
  },
  cellButton: {
    cursor: "pointer",
  },
  titleCell: {
    width: "100%",
    height: "50px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b5b5b5",
    border: "1px solid black",
  },
  chartContainer: {
    position: "relative",
    flex: 1,
    display: "flex",
    textAlign: "center",
    backgroundColor: "white",
    padding: "25px",
    textAlign: "start",
    //box shadow
    boxShadow:
      "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.1)",
  },
};

export default App;
