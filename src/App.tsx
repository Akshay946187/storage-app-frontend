
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Dir from './components/Dir';
import Signup from './components/Signup';
import Login from './components/Login';
import Layout from './components/Layout';
import Users from './components/Users';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true, // Use "index" instead of path for the default route
        element: <Dir />,
      },
      {
        path: 'dir/:dirId', // Note: removed leading slash
        element: <Dir />,
      },
      {
        path:"/users",
        element : <Users/>
      }
    ]
  },
  // These routes won't have the navbar
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  }
]);

function App() {
  return (
  <RouterProvider router={router}/>
  );
}

export default App;