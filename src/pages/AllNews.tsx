import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Root,
    Table,
    TableCell,
    Button,
    ButtonContainer,
    TableContainer
  } from "../styles";

// Define an interface for the news item object
interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_path: string;
  date: string;
}

const AllNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]); // Initialize newsItems as an empty array

  useEffect(() => {
    console.log("Fetching all news items");
    axios.get("https://adejord.co.uk/news") // Adjust URL as necessary
      .then((response) => {
        console.log("API Response:", response.data); // Log the API response data
        setNewsItems(response.data); // Set the newsItems state to the fetched data
      })
      .catch((error) => {
        console.error("Error fetching news items:", error);
      });
  }, []);

  return (
    <Root>
      <TableContainer>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px"
        }}>
          <h1 style={{ marginBottom: "20px" }}>News Items</h1>
          <Table>
            <thead style={{ background: "gray" }}>
              <tr><th>Title</th><th>Date</th><th>Content Preview</th><th>Image</th><th>Edit</th></tr>
            </thead>
            <tbody>
              {newsItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                  <td>{item.content.substring(0, 100)}...</td> {/* Preview the first 100 characters */}
                  <td>
                    {item.image_path ? (
                        <img src={`https://adejord.co.uk${item.image_path}`} alt="news" style={{ width: "100px", height: "auto" }} />
                    ) : "No Image"}
                  </td>
                  <td>
                    <Link to={`/editNews/${item.id}`} style={{
                      color: "blue",
                      textDecoration: "underline"
                    }}>
                      EDIT
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </TableContainer>
    </Root>
  );
};

export default AllNews;
