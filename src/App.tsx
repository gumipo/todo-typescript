import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { db, auth } from "./Firebase/index";
import { FormControl, List, TextField } from "@material-ui/core";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginButtom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.FC = (props: any) => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState<string>("");

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push("/login");
    });
    return () => unSub();
  });

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  return (
    <div className={styles.app__root}>
      <h1>Todo App React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await auth.signOut();
            props.history.push("/login");
          } catch (error) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="NewTask?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
