import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className="flex justify-center mt-32">
      <div className={styles.container}>
        <div className={styles.dot} />
      </div>
    </div>
  );
};

export default Loader;
