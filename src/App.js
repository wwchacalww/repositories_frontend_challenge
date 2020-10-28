import React, { useState, useEffect} from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  const [ techs, setTechs ] = useState([]);


  useEffect(() => {
    api.get('repositories').then( response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository() {
    const title = document.getElementById('title_input').value;
    const url = document.getElementById('url_input').value;

    const response = await api.post('repositories', {
      title,
      url,
      techs,
      likes : 0
    });
    setRepositories([...repositories, response.data]);
    document.getElementById('title_input').value = '';
    document.getElementById('url_input').value = '';
    setTechs([]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);

    const repositoriesIndex = repositories.findIndex( repository => repository.id === id );

    repositories.splice(repositoriesIndex, 1);

    setRepositories([...repositories]);
  }

  function handleAddTech(){
    setTechs([...techs, document.getElementById('techs_input').value ]);
    document.getElementById('techs_input').value = "";
  }

  async function handleAddLike(id){
    const response = await api.post(`repositories/${id}/like`);

    const repositoriesIndex = repositories.findIndex( repository => repository.id === id );
    repositories[repositoriesIndex].likes = response.data.likes;
    console.log(repositories[repositoriesIndex].likes);
    setRepositories([...repositories]);
  }

  return (
    <div>
      <ul data-testid="repository-list">
        { repositories.map( repository => {
          return (
            <li key={repository.id} >
              {repository.title}

              <button onClick={() => handleAddLike(repository.id)} > ( {repository.likes} ) Likes</button>

              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          )
        })}
        
      </ul>
      <p>Titulo</p>
      <input type="text" id="title_input" /> <br />
      <p>Url</p>
      <input type="text" id="url_input" /> <br />
      <p>Tecnologias</p>
      <input type="text" id="techs_input" /> <button onClick={handleAddTech}>+</button> <br />
      <ul>
        { techs.length > 0 ? 
          techs.map( tech => {
            return ( 
              <li key={tech}>{tech}</li>
            )
          })
        : <br/> }
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
