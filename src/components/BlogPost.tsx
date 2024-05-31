import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { IInputChange } from '../interfaces';
import { IPost, IComment } from '../interfaces';
import Comment from "../components/Comment";
import { apiBaseUrl } from '../config';
interface IPostComplete extends IPost{
    comments: IComment[],
}

export default function BlogPost() {

	const navigate = useNavigate();
	const post = useLoaderData() as IPostComplete;
    //
    post.comments.sort((a: IComment, b: IComment) => (new Date(b.date).valueOf() - new Date(a.date).valueOf()));
	
    //
	const [postingComment, setPostingComment] = useState(false);
    const [commentData, setCommentData] = useState<{author: string, text: string}>({author: "", text: ""});
    const [expandCommentInput, setExpandCommentInput] = useState(false);
	
    //
    const handleCommentInputChange = (e: IInputChange) => {
		setCommentData({ author: commentData.author, text: e.currentTarget.value });
    };
    
    //
	const handleAuthorInputChange = (e: IInputChange) => {
		setCommentData({ author: e.currentTarget.value, text: commentData.text });
	};

	//
	const handleCommentSubmit = (e: FormEvent) => {
		e.preventDefault();
		setPostingComment(true);
		const payload = { author: commentData.author, text: commentData.text };
		fetch(`${apiBaseUrl}/posts/${post._id}/comment`, {
			mode: 'cors',
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then((res) => {
				if (res.status >= 400) {
					throw new Error(`'Error with status: ${res.status}`);
				}
				return res.json();
			})
			.then((res) => {
				if (res.errors) {
					setCommentData({
						author: res.formData.author,
						text: res.formData.message,
					});
				} 
			})
			.catch((error) => console.error(error))
			.finally(() => {
				setExpandCommentInput(false);
				setCommentData({ author: '', text: '' });
				setPostingComment(false);
				navigate(`/posts/${post._id}`);
			});
	};

	//
	const handleCommentCancel = () => {
		setExpandCommentInput(false);
		setCommentData({ author: '', text: '' });
	};

	//
	const handleDeleteComment = async (commentId: string) => {
		//
		const token = localStorage.getItem("login-token");
		
		if (!token) {
			navigate("/login");
		}
		
		//
		const url = `${apiBaseUrl}/posts/${post._id}/comment/${commentId}`;
		
		//
		try {
			const result = await fetch(url, {
				mode: "cors",
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
			
			//
			if (result.status >= 400) {
				if (result.status === 401) {
					navigate("/login");
				}
				throw new Error(`${result.status}`);
			}

			//
			navigate(`/posts/${post._id}`);

		} catch (error) {
			console.log(error);
		}
	
	}

	return (
		<div className="flex flex-col gap-10">
			<article className="flex flex-col">
				<figure className="max-w-full">
					<img
						className="object-cover w-full 2xl:max-h-96 max-h-64"
						src={post.headerImage}
						alt="Post Image"
					/>
				</figure>
				<h1 className="text-5xl font-semibold">{post.title}</h1>
				<p className="italic">
					Posted in{' '}
					<span className="font-bold">
						{post.date ? new Date(post.date).toLocaleString() : "No Date Assigned"}
					</span>{' '}
					by{' '}
					<Link
						to={`/posts/author/${post.author}/page/1`}
						className="text-blue-300 hover:text-blue-500"
					>
						{post.author}
					</Link>
				</p>
				<p className="italic font-semibold mb-6">
					{post.timeToRead} min read
				</p>
				<p>{post.text}</p>
			</article>
			<form
				onSubmit={handleCommentSubmit}
				className="flex flex-col gap-2"
				id="comment"
				action=""
			>
				<label className="font-bold" htmlFor="message">
					Leave a comment
				</label>
				<textarea
					className="resize-none bg-slate-900 rounded"
					name="message"
					id="message"
					cols={30}
					rows={expandCommentInput ? 4 : 1}
					onFocus={() => setExpandCommentInput(true)}
					maxLength={300}
					onChange={handleCommentInputChange}
					value={commentData.text}
					required
				></textarea>

				{postingComment && (
					<p className="text-xl text-center"> Posting your comment ... </p>
				)}

				<div className={
					expandCommentInput && !postingComment
						? 'flex sm:flex-row flex-col items-center justify-end mt-2 gap-4 text-lg'
						: 'hidden'
					}
				>
					
					<label htmlFor="author" className="mr-auto font-bold text-sm">
						Your Name(Optional)
						<input
							className="bg-slate-900 ml-4 text-lg rounded"
							type="text"
							name="author"
							id="author"
							value={commentData.author}
							onChange={handleAuthorInputChange}
						/>
					</label>
					<div className='flex gap-4'>
						<button
							type="button"
							onClick={handleCommentCancel}
							className="px-4 py-1"
						>
							Cancel
						</button>
						<button className="px-4 py-1 bg-blue-200 text-slate-700 rounded">
							Post
						</button>
					</div>
				</div>
			</form>
			{post.comments.length > 0 && (
				<ul className="flex flex-col justify-start gap-5">
					{
						post.comments.map((comment) =>
							<Comment comment={comment} key={comment._id} handleDeleteComment={handleDeleteComment} />
						)
					}
				</ul>
			)}
		</div>
	);
}

BlogPost.propTypes = {
	data: PropTypes.object,
};
