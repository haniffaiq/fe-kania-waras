import React from 'react';
import FileUpload from '../../components/FileUpload';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Home = () => {
    return (
        <div className=''>
            <Header/>
            <FileUpload/>
            <Footer/>
        </div>
    );
};

export default Home;