import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";
const RSS_FEED_URL = "https://aws.amazon.com/blogs/hpc/feed/";

function App() {
    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        axios.get(`${CORS_PROXY}${RSS_FEED_URL}`)
            .then((response) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.data, "text/xml");
                const items = xmlDoc.getElementsByTagName("item");
                const blogs = [];

                for (let item of items) {
                    const title = item.getElementsByTagName("title")[0]?.textContent;
                    const link = item.getElementsByTagName("link")[0]?.textContent;
                    const description = item.getElementsByTagName("description")[0]?.textContent;

                    let imageURL = "";
                    const imgElement = item.querySelector('img');
                    if (imgElement) {
                        imageURL = imgElement.getAttribute("src") || "";
                    }

                    blogs.push({ title, link, description, imageURL });
                }

                setBlogData(blogs);
            })
            .catch((error) => console.error("Error fetching AWS blog content:", error));
    }, []);

    return (
        <div id="aws-blog-content">
            {blogData.map((blog, index) => (
                <React.Fragment key={index}>
                    <h2><a href={blog.link} target="_blank" rel="noopener noreferrer">{blog.title}</a></h2>
                    {blog.imageURL && <img src={blog.imageURL} alt={blog.title} />}
                    <div dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                    <hr />
                </React.Fragment>
            ))}
        </div>
    );
}

export default App;
