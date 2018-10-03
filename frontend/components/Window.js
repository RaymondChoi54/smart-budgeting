const Window = (props) => (
	<div className="back">
		<div className="bar">{props.barName}</div>
			<div className="window">
		    	{props.children}
		    </div>
		<style jsx>{`
			.bar {
				background: black;
				color: white;
				padding: 8px;
				border-radius: 1px;
				text-align: left;
				width: calc(100% - 16px);
			}

			.window {
				text-align: center;
				overflow: auto;
			}

			.back {
				text-align: center;
				background: rgba(254, 254, 254, 0.8);
				box-shadow: 0px 0px 4px #888888;
				height: 100%;
			}
		`}</style>

	</div>
)

export default Window