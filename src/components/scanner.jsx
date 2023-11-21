import React, { Component } from 'react';
import getTokens from './getTokens';
import Pagination from './common/pagination';
import paginate from './../utilities/paginate';


class Scanner extends Component {
  state = { 
    data: {
      container: `/* Example */
float sci_num = 2.23e-12
int n = 0;
int x = 3;
while(x == 13 || n == 11){
  n++;
  x--;
  string = "mamad";
}
` },
    tokens: [],
    pageSize: 6,
    currentPage: 1,
  }
  handleClick = () => {
    const { container:input } = this.state.data;
    const tokens = getTokens(input)
    this.setState({ tokens })
  }

  handleChange = e => {
    const data = { ...this.state.data };
    data.container = e.currentTarget.value;
    this.setState({data})
  }
    handlePageChange = (page) => {
    const currentPage = page;
    this.setState({ currentPage });
  };
  columns = [{ name: 'content' }, { name: 'token' }, { name: 'start' }, { name: 'end' }, { name: 'row' }]
  render() { 
    const { tokens, pageSize, currentPage } = this.state;
    const paginated = paginate(tokens,currentPage, pageSize)
    const totalCount = tokens.length;
  return (
   <div className='card-container'>
    <section className='form-section'>
          <h5>Enter your code</h5> 
        <div>
          <textarea value={this.state.data.container} onChange={this.handleChange} className="form-control" rows={10} />
        </div>
        <button className='btn btn-primary' style={{marginTop: '20px'}} onClick={this.handleClick}> Scan </button>
    </section>
      <section className='table-section'>
        <table className="table">
          <thead>
            <tr>
            {this.columns.map(column => <th  key={column.name} scope="col">{column.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginated.map(token => (
              <tr key={token.start * token.content* token.row}>
                <td>{ token.content }</td>
                <td>{ token.token }</td>
                <td>{token.startColumn }</td>
                <td>{token.endColumn}</td>
                <td>{token.row}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
              pageSize={pageSize}
              itemCount={totalCount}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
        />
   </section>
   </div>
  );
 }
}
 
export default Scanner;