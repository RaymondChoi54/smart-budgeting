function status(name) {
	if(name) {
		return <div>
			<li className="name">
				{name}
			</li>
			<style jsx>{`
				li {
					padding: 24px;
					text-align: center;
					display: block;
					font-family: Arial;
					font-size: 18px;
					color: white;
					float: right;
					font-weight: normal;
				}
			`}</style>
		</div>
	}
}

const Header = (props) => (
	<div>
		<ul>
			<li>
				Lime
			</li>
			{status(props.name)}
		</ul>
		<div className="contents">
			{props.children}
		</div>
		<style jsx>{`
			ul {
				list-style-type: none;
				background-color: black;
    			width: 100%;
    			margin: 0px;
    			padding: 0px;
    			overflow: hidden;
    			position: fixed;
    			top: 0px;
    			z-index: 1;
			}

			li {
				padding: 20px;
				text-align: center;
				display: block;
				font-family: Arial;
				font-size: 25px;
				font-weight: bold;
				color: white;
				float: left;
			}
			.contents {
				margin-top: 69px;
			}
		`}</style>

	</div>
)

export default Header