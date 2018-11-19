import axios from 'axios';

export const writPost = ({title, body, tags}) => axios.post('/api/posts', {title, body, tags});