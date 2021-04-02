import { LoadingPage } from './LoadingPage';
import './Tab1.css';



class Tab1 extends LoadingPage
{
    componentDidMount()
    {
        const p = new Promise((resolve) => {
            setInterval(resolve, 5000)
        })
        this.addLoadingProccess(p)
    }
}

export default Tab1;
