import {Route,Routes,BrowserRouter} from 'react-router-dom'
import VerifyOTP from './components/verifyOTP';
import SetPassword from './components/SetPassword';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import UserDashBoard from './components/UserDashBoard';
import AdminDashBoard from './components/AdminDashBoard';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UserRegister from './components/UserRegister';
import UserProducts from './components/UserProducts';
import EditProduct from './components/EditProduct';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Gallery from './components/Gallery';



function App() {
 

  return (
     
      <Routes>
        <Route path="/" element={<UserRegister/>} />
        <Route path="/verify-otp" element={<VerifyOTP/>} />
        <Route path="/set-password" element={<SetPassword/>} />
        <Route path='/adminlogin' element={<AdminLogin/>} />
        <Route path='/userlogin' element={<UserLogin/>} />
        <Route path='/userdashboard' element={<UserDashBoard/>} />
        <Route path='/admindashboard' element={<AdminDashBoard/>} />
        <Route path='/addproduct' element={<AddProduct/>} />
        <Route path='/productlist' element={<ProductList/>} />
        <Route path='/user/productlist' element={<UserProducts/>} />
        <Route path='/editproduct/:id' element={<EditProduct/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/navbar' element={<Navbar/>} />
        <Route path='/gallery' element={<Gallery/>} />
      </Routes>
    
  );
}

export default App
