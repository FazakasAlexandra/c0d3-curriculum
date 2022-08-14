const { useState, useEffect } = React;

const Kanban = () => {
  const [kanban, setKanban] = useState(()=> JSON.parse(localStorage.getItem("kanbanState")) ?? [
    {
      id: 1,
      title: "To-Do",
      list: [],
      color: "mediumpurple",
      input: "",
    },
    {
      id: 2,
      title: "Doing",
      list: [],
      color: "hotpink",
    },
    {
      id: 3,
      title: "Done",
      list: [],
      color: "cornflowerblue",
      input: "",
    },
    {
      id: 4,
      title: "Approved",
      list: [],
      color: "yellowgreen",
      input: "",
    },
  ]);

  useEffect(() => {
      localStorage.setItem("kanbanState", JSON.stringify([...kanban]))
  }, [kanban])

  const setStageInput = (id, value) => {
    setKanban(
      kanban.map((stage) => {
        if (stage.id === id) {
          stage.input = value;
        }
        return stage;
      })
    );
  };

  const addToStageList = (id) => {
    setKanban(
      kanban.map((stage) => {
        if (stage.id === id) {
          stage.list.push(stage.input);
          stage.input = "";
        }
        return stage;
      })
    );
  };

  const moveItem = (itemIdx, stageIdx, forward) => {
    const targetStageIdx = forward ? stageIdx + 1 : stageIdx - 1;

    // deep clones kanban
    const kanbanCopy = JSON.parse(JSON.stringify(kanban));

    kanbanCopy[targetStageIdx].list.push(
      kanbanCopy[stageIdx].list.splice(itemIdx, 1)
    );

    setKanban(kanbanCopy);
  };

  const removeItem = (itemIdx, stageIdx) => {
    if (
      confirm(
        "Are you absolutely certain you wanna delete this?\nIt is IRREVERSIBLE."
      ) === true
    ) {
      // deep clones kanban
      const kanbanCopy = JSON.parse(JSON.stringify(kanban));
      kanbanCopy[stageIdx].list.splice(itemIdx, 1);
      setKanban(kanbanCopy);
    }
  };

  return (
    <div className="row board">
      {kanban.map((stage, idx) => {
        return (
          <div className="column" key={stage.id}>
            <h1 style={{ background: stage.color }}>{stage.title}</h1>
            <ul>
              {stage.list.map((item, i) => {
                return (
                  <li key={`${item}-${i}`}>
                    {(idx && (
                      <div
                        className="arrow l"
                        onClick={() => moveItem(i, idx, false)}
                      >
                        &lt;
                      </div>
                    )) ||
                      null}
                    <span className="item" onClick={() => removeItem(i, idx)}>
                      {item}
                    </span>
                    {(idx < kanban.length - 1 && (
                      <div
                        className="arrow r"
                        onClick={() => moveItem(i, idx, true)}
                      >
                        &gt;
                      </div>
                    )) ||
                      null}
                  </li>
                );
              })}
            </ul>
            <div className="row">
              <textarea
                rows="4"
                value={stage.input}
                onChange={(e) => setStageInput(stage.id, e.target.value)}
              />
              <button onClick={(e) => addToStageList(stage.id)}>Submit</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Stars = () => {
  const [stars, setStars] = useState(["far", "far", "far", "far", "far"]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [locked, setLocked] = useState(false);

  const toggleStars = (targetStarIdx) => {
    let updatedStars = stars.map((_star, i) => {
      if (i <= targetStarIdx) {
        return "fas";
      }
      return "far";
    });

    setStars(updatedStars);
  };

  const count = stars.filter((star) => star === "fas").length;

  const pluralize = (nr, word) => {
    if (nr > 1) {
      return `${word}s`;
    }
    return word;
  };

  return (
    <div>
      <div
        className="row"
        onMouseLeave={() => {
          setLocked(false);
        }}
        onMouseEnter={() => {
          setSelectedIdx(null);
        }}
      >
        {stars.map((star, i) => (
          <i
            key={i}
            className={`${star} fa-star`}
            onMouseOver={() => {
              if (!locked) {
                toggleStars(i);
              }
            }}
            onClick={() => {
              if (!locked) {
                setLocked(true);
                setSelectedIdx(i);
              }
            }}
          ></i>
        ))}
      </div>
      <p>
        {(selectedIdx !== null &&
          `You have selected ${selectedIdx + 1} ${pluralize(
            selectedIdx + 1,
            "star"
          )}!`) ||
          `You are selecting ${count} ${pluralize(count, "star")}!`}
      </p>
    </div>
  );
};

const App = () => {
  let path = window.location.pathname;
  const lastPath = path.substring(path.lastIndexOf("/") + 1) || "/";

  const siteMap = {
    "/": <Kanban />,
    kanban: <Kanban />,
    stars: <Stars />,
  };

  if (siteMap[lastPath]) {
    return siteMap[lastPath];
  }
  return <h1>404 Error</h1>;
};

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(App));
