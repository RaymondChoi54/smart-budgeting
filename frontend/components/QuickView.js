import Config from '../config'

const columns = ["Category", "Item", "Price", "Date"]

function convert(row, element) {
	if(element == "Date") {
		return new Date(row[element.toLowerCase()]).toUTCString().slice(5, -13)
	} else if(element == "Price") {
		return "$" + row[element.toLowerCase()]
	} else if(element == "Category") {
		var index = row[element.toLowerCase()]
		if(index < Config.categories.length) {
			return Config.categories[row[element.toLowerCase()]]
		}
		return "Error"
	} else {
		return row[element.toLowerCase()]
	}
}

const QuickView = (props) => (
	<table>
		<tbody>
			<tr>
				{columns.map((column, index) => (<th>{column}</th>))}
			</tr>
			{props.data.map((expense, index) => (
				<tr>
					{columns.map((column, index) => (
						<td>{convert(expense, column)}</td>
					))}
				</tr>
			))}
		</tbody>
		<style jsx>{`
			table {
			    font-family: arial, sans-serif;
			    border-collapse: collapse;
			    width: 290px;
			   	font-size: 12px;
			   	text-align: center;
			   	height: 100%;
			   	overflow: auto;
			}

			tbody {
				overflow: auto;
			}

			td, th {
			    border: 1px solid #dddddd;
			    text-align: left;
			    padding: 8px;
			}

			tr {
				height: 40px;
			}

			tr:nth-child(even) {
				background: #CCC;
			}
		`}</style>

	</table>
)

export default QuickView