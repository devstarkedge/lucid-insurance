import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import InsuranceForm from './components/forms/InsuranceForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <InsuranceForm />
      <SpeedInsights />
    </div>
  );
}

export default App;
