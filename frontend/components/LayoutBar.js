import Layout from '../components/Layout'
import SideNav from '../components/SideNav'

// const LayoutBar = (props) => (
// 		    <Layout name={props.name}>
// 		 		<SideNav config={props.config}>
// 		 			<div className="back">
// 		 				<div className="bar">{props.barName}</div>
// 		 				{props.children}
// 		 			</div>
// 				</SideNav>
// 				<style jsx>{`
// 					.back {
// 						margin: 20px;
// 						margin-top: 89px;
// 						background: rgba(254, 254, 254, 0.8);
// 						width: calc(100% - 40px);
// 						height: 100%;
// 						box-shadow: 0px 0px 4px #888888;
// 						border-radius: 1px;
// 						z-index: -1;
// 					}

// 					.bar {
// 						background: black;
// 						color: white;
// 						padding: 8px;
// 						border-radius: 1px;
// 					}
// 				`}</style>
// 			</Layout>
// 		)


const LayoutBar = (props) => (
		    <Layout name={props.name}>
		 		<SideNav config={props.config}>
		 			<div className="back">
		 				{props.children}
		 			</div>
				</SideNav>
				<style jsx>{`
					.back {
						margin: 20px;
						margin-top: 89px;
						width: calc(100% - 40px);
						height: 100%;
						z-index: -1;
					}
				`}</style>
			</Layout>
		)

export default LayoutBar