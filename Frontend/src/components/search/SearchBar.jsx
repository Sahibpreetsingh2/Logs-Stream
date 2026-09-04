import React, { useState, useEffect } from 'react';

export default function SearchBar({ value, onSearch }) {
  const [term, setTerm] = useState(value || '');

  useEffect(() => setTerm(value || ''), [value]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-bar-input-wrap">
        <span className="search-bar-icon">⌕</span>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search log messages… e.g. NullPointerException, timeout, orderId=4471"
          className="input search-bar-input"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}
