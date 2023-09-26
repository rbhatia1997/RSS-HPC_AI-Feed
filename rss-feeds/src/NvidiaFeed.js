import React, { useEffect, useState } from 'react';
import axios from 'axios';
const NVIDIA_FEED_URL_1 = "https://rbhatia1997.github.io/RSS-HPC_AI-Feed/nvidia-feed1.xml";
const NVIDIA_FEED_URL_2 = "https://rbhatia1997.github.io/RSS-HPC_AI-Feed/nvidia-feed2.xml";

function NvidiaFeed() {
    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        const fetchData = (url) => {
            axios.get(url)
                .then((response) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response.data, "text/xml");
                    const items = xmlDoc.getElementsByTagName("item");
                    const blogs = [];

                    for (let item of items) {
                        const title = item.getElementsByTagName("title")[0]?.textContent;
                        const link = item.getElementsByTagName("link")[0]?.textContent;
                        const description = item.getElementsByTagName("description")[0]?.textContent;

                        blogs.push({ title, link, description });
                    }

                    setBlogData(prevBlogs => [...prevBlogs, ...blogs]);
                })
                .catch((error) => console.error("Error fetching NVIDIA blog content:", error));
        };

        fetchData(NVIDIA_FEED_URL_1);
        fetchData(NVIDIA_FEED_URL_2);        
    }, []);

    return (
        <div id="nvidia-blog-content">
            {blogData.map((blog, index) => (
                <React.Fragment key={index}>
                    <h2><a href={blog.link} target="_blank" rel="noopener noreferrer">{blog.title}</a></h2>
                    <div dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                    <hr />
                </React.Fragment>
            ))}
        </div>
    );
}

export default NvidiaFeed;
