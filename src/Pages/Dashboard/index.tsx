import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Title, Form, Repositories, Error } from './styles';
import logoImg from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GitHubExplore:repositories',
    );
    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });
  const [repo, setRepo] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplore:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  const handleAddReposiory = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!repo) {
      setInputError('Digite o autor/nome do repositorio');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${repo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Erro na busca por este repositório');
    }
  };

  return (
    <>
      <img src={logoImg} alt="Logo GitHub" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddReposiory}>
        <input
          onChange={(e) => setRepo(e.target.value)}
          value={repo}
          placeholder="Digite o nome do repositório"
          type="text"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
