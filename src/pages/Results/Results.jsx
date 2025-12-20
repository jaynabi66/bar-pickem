import './Results.css';

export const ResultsPage = '/results';

const Results = () => {
    return (
        <div className='content results-component'>
            <h1 className="title">
                RESULTS
            </h1>
            <div className="select">
                <div className="input-row">
                    <label htmlFor="year">Year:</label>
                    <input type="number" id="year" name="year" min="2020" value="2025" required></input>
                </div>
                <div className="input-row">
                    <label htmlFor="week">Week:</label>
                    <input type="number" id="week" name="week" min="1" value="1" required></input>
                </div>
                <div className="input-row">
                    <button className="button">
                        Get results
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Age</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0001</td>
                        <td>30</td>
                        <td>New York</td>
                    </tr>
                    <tr>
                        <td>0101</td>
                        <td>25</td>
                        <td>Los Angeles</td>
                    </tr>
                </tbody>
            </table>
            <div className="buttons-wrapper">
                <button className="button">
                    Next
                </button>
                <button className="button">
                    Done
                </button>
            </div>
        </div>
    )
}

export default Results;
