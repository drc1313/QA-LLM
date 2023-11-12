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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://' + ServerIP + ':5000/questions');
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
      const response = await fetch('http://' + ServerIP + ':5000/questions/' + itemId, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('There was an error deleting the item', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <h1>Q&A Web App</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="questionInput">Your Question:</label>
          <textarea
            id="questionInput"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your question here"
          />
          <label htmlFor="answerInput">Your Answer:</label>
          <textarea
            id="answerInput"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here"
          />
          <button type="submit">Submit</button>
        </form>
      </header>
      <main>
        <h2>Questions and Answers</h2>
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <span>{item.content} - {item.answer}</span>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
