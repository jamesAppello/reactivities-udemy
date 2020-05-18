import React from 'react'
import { Container, Segment, Header, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
            <Segment 
                inverted 
                textAlign='center' 
                vertical 
                className='masthead'>
                    <Container text>
                        <Header as='h1' inverted>
                            <Icon 
                                name='group' 
                                size='massive' 
                                alt='logo' 
                                style={{ marginBottom: 12 }} 
                            /> Reactivities
                        </Header>
                        <Header 
                            as='h2' 
                            inverted 
                            content='Welcome to Reactivities' 
                        />
                        <Button 
                            as={Link} 
                            to='/activities' 
                            size='huge' 
                            inverted>
                            Take me to the activities!
                        </Button>
                    </Container>
            </Segment>
    )
}
export default HomePage;