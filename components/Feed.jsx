'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    filterPosts(value.toLowerCase());
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    filterPosts(tag.toLowerCase());
  };

  const filterPosts = (searchValue) => {
    const filtered = posts.filter(
      (post) =>
        post.prompt.toLowerCase().includes(searchValue) ||
        post.tag.toLowerCase().includes(searchValue) ||
        post.creator.username.toLowerCase().includes(searchValue)
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/prompt');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag, username, or prompt'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
        {searchText && (
          <button
            type='button'
            onClick={() => {
              setSearchText('');
              setFilteredPosts(posts);
            }}
            className='text-xs absolute right-4 text-gray-500 cursor-pointer'
          >
            Clear
          </button>
        )}
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;