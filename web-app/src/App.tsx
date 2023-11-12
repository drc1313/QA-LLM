import React, { useEffect, useState } from 'react';
import './App.css';

const ServerIP = "192.168.1.225";
interface QAObject
{
  id:number,
  content:string,
  answer:string
}
function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [items, setItems] = useState<QAObject[]>([]);
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const url = `http://${ServerIP}:5000/questions?search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
        const response = await fetch('http://'+ServerIP+':5000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: question, answer: answer }),
        });
  
        if (response.ok) {
            console.log('Question and Answer submitted successfully');
            fetchData();
            // Handle successful submission, e.g., clearing the form or showing a success message
        } else {
            console.error('Submission failed');
            // Handle errors
        }
    } catch (error) {
        console.error('There was an error submitting the question and answer', error);
    }
  };

  const handleDelete = async (itemId:number) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this item?");
      if(isConfirmed)
      {
        const response = await fetch('http://' + ServerIP + ':5000/questions/' + itemId, {
          method: 'DELETE',
        });
      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        console.error('Delete failed');
      }
    }

    } catch (error) {
      console.error('There was an error deleting the item', error);
    }
  };

const [editingId, setEditingId] = useState<number | null>(null);
const [editQuestion, setEditQuestion] = useState('');
const [editAnswer, setEditAnswer] = useState('');

// Function to start editing an item
const handleEdit = (item: QAObject) => {
  setEditingId(item.id);
  setEditQuestion(item.content);
  setEditAnswer(item.answer);
};

// Function to save the edited item
const handleSaveEdit = async (itemId: number) => {
  try {
    const response = await fetch('http://' + ServerIP + ':5000/questions/' + itemId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editQuestion, answer: editAnswer }),
    });

    if (response.ok) {
      setEditingId(null);
      fetchData();
    } else {
      console.error('Edit failed');
    }
  } catch (error) {
    console.error('There was an error updating the item', error);
  }
};

// Function to cancel the editing
const handleCancelEdit = () => {
  setEditingId(null);
};


return (
  <div className="App">
  <header className="App-header">
    <h1>Q&A Web App</h1>
    <form onSubmit={handleSubmit}>
      
      <div className="input-group">
        <label htmlFor="question-input">Your Question:</label>
        <br/>
        <textarea id="question-input" className="textarea"></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="answer-input">Your Answer:</label>
        <br/>
        <textarea id="answer-input" className="textarea"></textarea>
      </div>

      <button className="btn" type="submit">Submit</button>
    </form>
  </header>
  
  <main>
      <h2>Questions and Answers</h2>
      <input 
        type="text"
        placeholder="Search for questions"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input-style"  // Add the class name to apply the styles
      />
      <table className="qa-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          
          {items.filter(item => item.content.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
            <tr key={item.id}>
              {editingId === item.id ? (
                <td>
                  <textarea value={editQuestion} onChange={e => setEditQuestion(e.target.value)} />
                  <textarea value={editAnswer} onChange={e => setEditAnswer(e.target.value)} />
                  <button className="btn" onClick={() => handleSaveEdit(item.id)}>Save</button>
                  <button className="btn" onClick={handleCancelEdit}>Cancel</button>
                </td>
              ) : (
                <>
                  <td>{item.content}</td>
                  <td>{item.answer}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  </main>
</div>

);
}

export default App;