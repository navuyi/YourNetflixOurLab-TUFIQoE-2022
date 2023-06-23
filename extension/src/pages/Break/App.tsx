import React from "react";
import {Routes, HashRouter, Route,} from "react-router-dom"
import ExperimentBreak from './views/ExperimentBreak/ExperimentBreak';
import ExperimentFinished from './views/ExperimentFinished/ExperimentFinished';
import "./style.module.scss"
import Landing from './views/Landing';



const App = () => {
  

  return (
    <>
      <HashRouter>
        <Routes>
          <Route 
            path="/"
            element={<Landing />}
          />
          <Route 
            path="/break"
            element={<ExperimentBreak/>}
          />
          <Route 
            path="/finished"
            element={<ExperimentFinished />}
          />
        </Routes>
      </HashRouter>
    </>
  );
};

export default App;