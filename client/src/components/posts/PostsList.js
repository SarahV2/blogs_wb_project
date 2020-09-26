import React, { Component } from 'react'

export default class PostsList extends Component {
    state={
        list:[]
    }
    componentDidMount(){
        console.log('in posts')
        const postsList=this.props.userPosts;
        this.setState({
            list:postsList
        })
    }
    render() {
        const {list}=this.state
        console.log(list)
        return (
            <div>
                
            </div>
        )
    }
}
