// # For deployment: npm run deploy



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import NvidiaFeed from './NvidiaFeed';

const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";
const RSS_FEED_URL = "https://aws.amazon.com/blogs/hpc/feed/";
const FETCH_DELAY = 600000;  // 10 minutes in milliseconds

function App() {
    const [feedType, setFeedType] = useState('aws'); // This will be either 'aws' or 'nvidia'
    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
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
                        const encodedContent = item.getElementsByTagName("content:encoded")[0]?.textContent;
                        if (encodedContent) {
                            // Parsing the encoded content to extract the image URL
                            const contentDoc = parser.parseFromString(encodedContent, "text/html");
                            const imgElement = contentDoc.querySelector('img');
                            if (imgElement) {
                                imageURL = imgElement.getAttribute("src") || "";
                            }
                        }

                        blogs.push({ title, link, description, imageURL });
                    }

                    setBlogData(blogs);
                })
                .catch((error) => console.error("Error fetching AWS blog content:", error));
        };

        fetchData();  // Call immediately on first load
        const intervalId = setInterval(fetchData, FETCH_DELAY);

        return () => clearInterval(intervalId); // Cleanup when component unmounts
    }, []);

    return (
      <div>
          <button onClick={() => setFeedType(feedType === 'aws' ? 'nvidia' : 'aws')}>
              Switch to {feedType === 'aws' ? 'NVIDIA' : 'AWS'} Feed
          </button>

          {feedType === 'aws' 
           ? (
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
             )
           : <NvidiaFeed />
          }
      </div>
  );
}

export default App;