import Layout from '../components/Layout'
import SideNav from '../components/SideNav'

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