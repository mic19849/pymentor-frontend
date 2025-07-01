import React from 'react';

const QuizComponent = ({ question, options, selectedOption, handleOptionChange }) => (
  <div className="bg-white p-4 rounded-xl shadow-md mb-4">
    <p className="font-semibold mb-2">{question}</p>
    {options.map((option, idx) => (
      <label key={idx} className="block p-2 rounded cursor-pointer hover:bg-gray-100">
        <input
          type="radio"
          name="option"
          value={option}
          checked={selectedOption === option}
          onChange={() => handleOptionChange(option)}
          className="mr-2"
        />
        {option}
      </label>
    ))}
  </div>
);

export default QuizComponent;
