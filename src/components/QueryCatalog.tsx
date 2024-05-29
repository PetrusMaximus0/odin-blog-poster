import { useParams } from 'react-router-dom';
import Catalog from './Catalog';

export default function QueryCatalog() {
	const { queryType: queryType, query: query, name: name } = useParams();
	return (
		<div>
			{(queryType === 'search' && (
				<h1 className="text-5xl mb-8">{`Search results for: "${query}"`}</h1>
			)) || (
				<h1 className="text-5xl mb-8 ">
					<span className="capitalize">{queryType}: </span> {name || query}{' '}
				</h1>
			)}
			<Catalog fromQuery={true} />
		</div>
	);
}
