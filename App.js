import React, { useState, useEffect } from 'react'; 
import ReactPaginate from "react-paginate";
import styles from "./components/App.module.css";
import './App.css'; 

const applyUpdateResult = (result) => (prevState) => ({
  hits: [...prevState.hits, ...result.hits],
  page: result.page,
});

const applySetResult = (result) => (prevState) => ({
  hits: result.hits,
  page: result.page,
});

const getHackerNewsUrl = (story, page) =>
  `https://hn.algolia.com/api/v1/search?tags=story&&page=5`;


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: null,
      delay: 1000,
    };
  }

  onInitialSearch = (e) => {
    e.preventDefault();

    const { story } = this.input;

    if ( story === '') {
      return;
    }

    this.fetchStories(story, 0);
  }

  onPaginatedSearch = (e) =>
    this.fetchStories(this.input.story, this.state.page + 1);

  fetchStories = (story, page) =>
    fetch(getHackerNewsUrl(story, page))
      .then(response => response.json())
      .then(result => this.onSetResult(result, page));

  onSetResult = (result, page) =>
    page === 0
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));

  componentDidMount() {
  this.timer = setInterval(()=> this.setState(), 1000);
  }

  componentWillUnmount() {
  this.timer = null;  
  }

  fetchStories() {
  fetch(this.getEndpoint("https://hn.algolia.com/api/v1/search?tags=story&&page=5 endpoint"))
    .then(result => result.json())
    .then(result => this.setState({ items: result }));
  }

  render() {
    return (
      <div className="page">
        <div className="interactions">
        <h1>HACKER STORIES</h1>
          <form type="submit" onSubmit={this.onInitialSearch}>
            <input type="text" placeholder="Search for Posts" ref={node => this.input = node} />
            <button type="submit">Search</button>
          </form>
          <br/>
          <br/>

        </div>

        <List
          list={this.state.hits}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
      </div>
    );
  }
}

const List = ({ list, page, onPaginatedSearch }) =>
  <div>
    <div className="list">
      {list.map(item => <div className="list-row" key={item.objectID}>
        <a href={item.url}>{item.title}</a>
      </div>)}
    </div>
  

    <div className="interactions">
      {
        page !== null &&
        <button
          type="button"
          onClick={onPaginatedSearch}
        >
      <nav className="justify-content-center">
        <ul className="pagination">
          <li className="page-link">1</li>
          <li className="page-link">2</li>
          <li className="page-link">3</li>
          <li className="page-link">4</li>
          <li className="page-link">5</li>
          <li className="page-link">6</li>
          <li className="page-link">7</li>
          <li className="page-link">8</li>
          <li className="page-link">9</li>
          <li className="page-link">10</li>
          ...
          <li className="page-link">Next</li>
        </ul>
      </nav>
        </button>
      }
    </div>
  </div>

export default App;

