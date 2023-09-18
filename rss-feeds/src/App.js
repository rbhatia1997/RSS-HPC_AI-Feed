import React, { useEffect, useState } from 'react';
import './App.css';

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const RSS_FEED_URL = "https://aws.amazon.com/blogs/hpc/feed/";

function App() {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    fetch(`${CORS_PROXY}${RSS_FEED_URL}`)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");
        const blogs = [];

        for (let item of items) {
          const title = item.getElementsByTagName("title")[0].textContent;
          const link = item.getElementsByTagName("link")[0].textContent;
          const description = item.getElementsByTagName("description")[0].textContent;

          let imageURL = "";
          const mediaContent = item.getElementsByTagName("media:content")[0];
          if (mediaContent) {
            imageURL = mediaContent.getAttribute("url") || "";
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
