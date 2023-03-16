// import React, {TouchableOpacity} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/home/index';

function Rotas(){
    <BrowserRouter>
    <Routes>
        <Route exact path='/' component={ Home } ></Route>
    </Routes>
    </BrowserRouter>
}

export default Rotas;