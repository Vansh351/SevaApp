import React, { useState, useEffect } from "react";
import DonateForm from "./donateform";
import { percentCompleted } from "../utills/math";
import styles from "./styles/progressBar.module.css";

const ProgressBar = (props) => {
  const [state, setState] = useState(0);
  useEffect(
    () =>
      setState(() => percentCompleted(props.fundRaised, props.fundRequired)),
    [props.fundRaised, props.fundRequired]
  );

  return (
    <React.Fragment>
      <div className={`p-2 col-11 ${styles.progressBar}`}>
        <div className="row justify-content-between">
          <div className="col-4">
            <p className={styles.label}>Raised:</p>
            <div>
              <i className="fa fa-inr" aria-hidden="true"></i>
              <span className={styles.value}>{props.fundRaised}</span>
            </div>
          </div>
          <div className="col-4 text-right">
            <p className={styles.label}>Goal:</p>
            <div>
              <i className="fa fa-inr" aria-hidden="true"></i>
              <span className={styles.value}>{props.fundRequired}</span>
            </div>
          </div>
        </div>

        <div className={`progress ${styles.progress} `}>
          <div
            className={`progress-bar progress-bar-animated 
              ${styles.barColor}
            `}
            role="progressbar"
            aria-valuenow={state}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${state}%` }}
          ></div>
        </div>

        {props.isCompleted === true && (
      
      <div
        className="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        { console.log(props.isCompleted,"completed")}
        <b>Warning:</b> The amount required for the campaign has been raised . 
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )}

        <DonateForm
          id={props.id}
          fundRequired={props.fundRequired}
          fundRaised={props.fundRaised}
          amount={props.amount}
          onAmountChange={props.onAmountChange}
          isActivated={props.isActivated}
        />
      </div>
    </React.Fragment>
  );
};

export default ProgressBar;
