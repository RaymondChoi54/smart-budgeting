function convert(row, element) {
	if(element == "Date") {
		return new Date(row[element.toLowerCase()]).toDateString()
	} else if(element == "Price") {
		return "$" + row[element.toLowerCase()]
	} else {
		return row[element.toLowerCase()]
	}
}

const Table = (props) => (
	<table>
		<tbody>
			<tr>
				{props.header.map((element, index) => <th key={index}>{element}</th>)}
			</tr>
			{props.data.map((row, x) => <tr key={x}>{props.header.map((element, y) => <td key={x + "," + y}>{convert(row, element)}</td>)}</tr>)}
		</tbody>
		<style jsx>{`
			table {
			    font-family: arial, sans-serif;
			    border-collapse: collapse;
			    width: 90%;
			}

			td, th {
			    border: 1px solid #dddddd;
			    text-align: left;
			    padding: 8px;
			}

			tr:nth-child(even) {
			    background-color: #dddddd;
			}

		`}</style>
	</table>
)

export default Table