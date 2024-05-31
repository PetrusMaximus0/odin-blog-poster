import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiChatOutline } from '@mdi/js';
import { useState } from 'react';
import { IPost } from '../interfaces';

export default function BlogCard({ data, handlePostAction }: {data: IPost, handlePostAction: (action: string)=>void}) {
	//
	const [action, setAction] = useState("");

	//
	const handleRequestAction = (actionName: string) => {
		setAction(actionName);
	}

	//
	const handleConfirmAction = () => {
		handlePostAction(action);
		setAction("");
	}

	const handleCancelAction = () => {
		setAction("");
	}
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-center text-blue-300 hover:text-blue-600 mr-auto text-4xl font-light">
				<Link to={`/posts/${data._id}`}>{data.title}</Link>
			</h2>
			<p className="sm:text-left text-center">{data.description}</p>
			<p className="flex gap-4 justify-center sm:justify-start italic font-light">
				<Link
					className="text-blue-300 hover:text-blue-600"
					to={`/date/${new Date(data.date!).getFullYear()}/page/1`}
				>
					{new Date(data.date!).toLocaleDateString()}
				</Link>
				| {data.timeToRead} min read |
				<Link
					className="flex text-sm items-center text-blue-300 hover:text-blue-600"
					to={`/posts/${data._id}`}
				>
					<Icon path={mdiChatOutline} size={1} />({data.comments!.length})
				</Link>
			</p>
			{
				!action && (
					<p className='text-lgfont-semibold flex gap-4 justify-center'>
						<button onClick={()=>handleRequestAction("edit")} className='text-blue-300 hover:text-blue-600 hover:bg-white hover:font-bold bg-slate-900 px-2 py-1 rounded'>
							Edit
						</button>
						<button onClick={()=>handleRequestAction(data.hidden ? "publish" : "hide")} className='text-blue-300 hover:text-blue-600 hover:bg-white hover:font-bold bg-slate-900 px-2 py-1 rounded'>
							{data.hidden && "Publish" || 
								"Hide Post"
							}
						</button>
						<button onClick={()=>handleRequestAction("delete")} className='text-red-300 hover:text-red-600 hover:bg-white hover:font-bold bg-slate-900 px-2 py-1 rounded'>
							Delete
						</button>
					</p>
				) || 

				<div className='flex gap-4 items-center mx-auto'>
					<p>
						<span className='uppercase font-bold'>{action}</span> the blogpost ?
					</p>
					<button onClick={handleConfirmAction} className='text-red-300 hover:text-blue-600 hover:bg-white hover:font-bold bg-slate-900 px-2 py-1 rounded'> Confirm </button>	
					<button onClick={handleCancelAction} className='text-blue-300 hover:text-blue-600 hover:bg-white hover:font-bold bg-slate-900 px-2 py-1 rounded'> Cancel </button>	
				</div>

			}
			
			<hr />
		</div>
	);
}

BlogCard.propTypes = {
	data: PropTypes.object,
};
