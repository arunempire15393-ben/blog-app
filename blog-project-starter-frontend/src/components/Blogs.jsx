 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './common/Footer';
import { auth } from '../config/firebase';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [loading, setLoading] = useState(false);
 const API_URL = `${process.env.REACT_APP_API_URL}/api/blogs`;

    // Fetch all blogs
    const fetchBlogs = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('Blogs fetched:', response.data);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error.response?.data || error.message);
        }
    };

    // Firebase authentication and initial blog loading
    useEffect(() => {
        window.scrollTo(0, 0);

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Logged in user:', user.uid);

                if (user.uid === 'p2Lv8vfBfLfsRyEBy6OQ40WCdT73') {
                    setAdmin(true);
                } else {
                    setAdmin(false);
                }
            } else {
                console.log('No user is signed in.');
                setAdmin(false);
            }
        });

        fetchBlogs();

        return () => unsubscribe();
    }, []);

    // Add new blog
    const handleNewBlogSubmit = async (event) => {
        event.preventDefault();

        if (!newTitle.trim() || !newContent.trim()) {
            alert('Please enter blog title and content.');
            return;
        }

        try {
            setLoading(true);

            const today = new Date();

            const date = today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const response = await axios.post(API_URL, {
                newTitle: newTitle.trim(),
                newContent: newContent.trim(),
                date,
                likes: 0
            });

            console.log('Blog added successfully:', response.data);

            await fetchBlogs();

            setNewTitle('');
            setNewContent('');

            alert('Blog added successfully!');
        } catch (error) {
            console.error('Error adding blog:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to add blog.');
        } finally {
            setLoading(false);
        }
    };

    // Like a blog
    const handleLike = async (blogId) => {
        try {
            const response = await axios.patch(
                `${API_URL}/like/${blogId}`
            );

            console.log('Like response:', response.data);

            await fetchBlogs();

        } catch (error) {
            console.error(
                'Error liking blog:',
                error.response?.data || error.message
            );

            alert(error.response?.data?.message || 'Unable to like this blog.');
        }
    };

    return (
        <div className="blog-section py-14">

            <h2 className="text-center text-5xl font-bold mb-14">
                Latest <span className="text-orange-400">Blogs</span> 📚
            </h2>

            {/* Admin blog creation form */}
            {admin && (
                <div
                    className="blog-creation-form mb-8"
                    style={{ width: '80%', margin: 'auto' }}
                >
                    <form
                        onSubmit={handleNewBlogSubmit}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Blog Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="p-2 border rounded"
                            required
                        />

                        <textarea
                            placeholder="Blog Content"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="p-2 border rounded"
                            rows="4"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Blog'}
                        </button>
                    </form>
                </div>
            )}

            {/* Display blogs */}
            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">

                {blogs.length === 0 ? (
                    <p className="text-center text-gray-500 col-span-2">
                        No blogs available.
                    </p>
                ) : (
                    blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg"
                        >
                            <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">
                                {blog.newTitle}
                            </h3>

                            <p className="blog-date text-gray-400 text-sm mb-4">
                                {blog.date}
                            </p>

                            <p className="blog-content text-gray-600 mb-4">
                                {blog.newContent}
                            </p>

                            <button
                                type="button"
                                className="text-blue-500 cursor-pointer"
                                onClick={() => handleLike(blog._id)}
                            >
                                Like
                            </button>

                            <span className="ml-2">
                                {blog.likes ?? 0} Likes
                            </span>
                        </div>
                    ))
                )}

            </div>

            <Footer />

        </div>
    );
}

export default Blogs;
