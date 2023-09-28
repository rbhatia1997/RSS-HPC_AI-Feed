import React, { useEffect, useState } from 'react';
import './App.css';
import NvidiaFeed from './NvidiaFeed';
import axios from 'axios';


// const RSS_FEED_URL = "/RSS-HPC_AI-Feed/public/aws-feed.xml";
const RSS_FEED_FILE = feedType => 
    feedType === 'aws' 
    ? "https://rbhatia1997.github.io/RSS-HPC_AI-Feed/aws-feed.xml" 
    : "https://rbhatia1997.github.io/RSS-HPC_AI-Feed/nvidia-feed.xml";


function App() {
    const [feedType, setFeedType] = useState('aws'); // This will be either 'aws' or 'nvidia'
    const [blogData, setBlogData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            axios.get(RSS_FEED_FILE(feedType))
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
                .catch((error) => console.error("Error fetching blog content:", error));
        };

        fetchData(); 
    }, [feedType]);  // This dependency ensures the fetchData re-runs when feedType changes

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