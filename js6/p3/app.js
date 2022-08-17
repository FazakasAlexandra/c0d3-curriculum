const { useState, useEffect } = React;

const KANBAN_DIRECTIONS = {
  forward: "forward",
  backward: "backward",
};

const BoardForm = ({ actions, board }) => {
  return (
    <div className="row">
      <textarea
        rows="4"
        value={board.input}
        onChange={(e) => actions.setInput(e.target.value)}
      />
      <button onClick={(_e) => actions.addToList(board.id)}>Submit</button>
    </div>
  );
};

const BoardItem = ({ showLeftArrow, showRightArrow, actions, children }) => {
  return (
    <li>
      {(showLeftArrow && (
        <div
          className="arrow l"
          onClick={() => actions.move(KANBAN_DIRECTIONS.backward)}
        >
          &lt;
        </div>
      )) ||
        null}
      <span className="item" onClick={() => actions.remove()}>
        {children}
      </span>
      {(showRightArrow && (
        <div
          className="arrow r"
          onClick={() => actions.move(KANBAN_DIRECTIONS.forward)}
        >
          &gt;
        </div>
      )) ||
        null}
    </li>
  );
};

const Board = ({ board, children }) => {
  return (
    <div className="column">
      <h1 style={{ background: board.color }}>{board.title}</h1>
      {children}
    </div>
  );
};

const Kanban = ({ boards }) => {
  const [kanban, setKanban] = useState(boards);

  const setBoardInput = (boardId, value) => {
    setKanban(
      kanban.map((board) => {
        if (board.id === boardId) {
          console.log(value);
          board.input = value;
        }
        return board;
      })
    );
  };

  const addItemToBoardList = (boardId) => {
    setKanban(
      kanban.map((board) => {
        if (board.id === boardId) {
          board.list.push(board.input);
          board.input = "";
        }
        return board;
      })
    );
  };

  const moveItem = (itemIndex, boardIndex, direction) => {
    const targetBoardIndex =
      direction === KANBAN_DIRECTIONS.forward ? boardIndex + 1 : boardIndex - 1;

    // deep clones kanban
    const kanbanCopy = JSON.parse(JSON.stringify(kanban));

    kanbanCopy[targetBoardIndex].list.push(
      kanbanCopy[boardIndex].list.splice(itemIndex, 1)
    );

    setKanban(kanbanCopy);
  };

  const removeItem = (itemIndex, boardIndex) => {
    if (
      confirm(
        "Are you absolutely certain you wanna delete this?\nIt is IRREVERSIBLE."
      ) === true
    ) {
      // deep clones kanban
      const kanbanCopy = JSON.parse(JSON.stringify(kanban));
      kanbanCopy[boardIndex].list.splice(itemIndex, 1);
      setKanban(kanbanCopy);
    }
  };

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify([...kanban]));
  }, [kanban]);

  return (
    <div className="row boards">
      {kanban.map((board, boardIndex) => {
        return (
          <Board key={board.id} board={board}>
            <ul>
              {board.list.map((item, itemIndex) => (
                <BoardItem
                  key={`${boardIndex}-${itemIndex}`}
                  showLeftArrow={!!boardIndex}
                  showRightArrow={boardIndex < kanban.length - 1}
                  actions={{
                    remove: () => removeItem(itemIndex, boardIndex),
                    move: (direction) =>
                      moveItem(itemIndex, boardIndex, direction),
                  }}
                >
                  {item}
                </BoardItem>
              ))}
            </ul>
            <BoardForm
              board={board}
              actions={{
                addToList: () => addItemToBoardList(board.id),
                setInput: (value) => setBoardInput(board.id, value),
              }}
            />
          </Board>
        );
      })}
    </div>
  );
};

const Star = ({ events, star }) => {
  return <i className={`${star} fa-star`} {...events}></i>;
};

const Stars = ({ number }) => {
  const [stars, setStars] = useState(Array(number).fill("far"));
  const [selectedStar, setSelectedStar] = useState(null);
  const [locked, setLocked] = useState(false);
  const count = stars.filter((star) => star === "fas").length;

  const toggleStars = (targetStarIdx) => {
    setStars(
      stars.map((_star, i) => {
        if (i <= targetStarIdx) {
          return "fas";
        }
        return "far";
      })
    );
  };

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
        onMouseLeave={() => setLocked(false)}
        onMouseEnter={() => setSelectedStar(null)}
      >
        {stars.map((star, index) => (
          <Star
            key={index}
            star={star}
            events={{
              onMouseOver: (_event) => {
                if (!locked) {
                  toggleStars(index);
                }
              },
              onClick: (_event) => {
                if (!locked) {
                  setLocked(true);
                  setSelectedStar(index);
                }
              },
            }}
          />
        ))}
      </div>
      <p>
        {(selectedStar !== null &&
          `You have selected ${selectedStar + 1} ${pluralize(
            selectedStar + 1,
            "star"
          )}!`) ||
          `You are selecting ${count} ${pluralize(count, "star")}!`}
      </p>
    </div>
  );
};

const App = () => {
  const path = window.location.pathname;
  const lastPath = path.substring(path.lastIndexOf("/") + 1) || "/";
  const boards = JSON.parse(localStorage.getItem("boards")) ?? [
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
  ];

  const siteMap = {
    "/": <Kanban boards={boards} />,
    kanban: <Kanban boards={boards} />,
    stars: <Stars number={5} />,
  };

  if (siteMap[lastPath]) {
    return siteMap[lastPath];
  }
  return <h1>404 Error</h1>;
};

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(App));
