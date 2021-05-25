import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {

    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a list of highly active React Meetups" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>

    )
}

// getServerSideProps can get req and res, while getStaticProps can get the params when using context-prop

// will not run during build process but olways on the server
// can also fetch data from an API
// revelidate can't be used here but it runs for every incoming request anyway
// getServerSideProps is only better if data changes multiple times a second because NextJS has to wait every time the data is updated
// should only be used if you need access to the GET-request-object like for authentification

// export async function getServerSideProps(context) {
//    const req = context.req;
//    const res = context.res;


//    return {
//        props: {
//            meetups: DUMMY_MEETUPS
//        }
//    }
// }


// executes during pre-render-process
// can only be used in page-components
// is faster than getServerSideProps
// always use when fetching data that should be displayed when page loads
// any of this code will never end up on the client-side so you can run any server-side execution like fething from an API
// you always need to return a props-object, that will be received fom this HomePage-component
// makes useState and useEffect obsolete

// revalidate-prop starts "incremental static generation"
// is optional
// the number is in seconds and tells NextJS how long to wait before regenerating for an incoming request of the page
// number determines update frequency
// is used for pages that often gets new data that it has to update 


export async function getStaticProps() {
    const client = await MongoClient.connect('mongodb+srv://karin:bVa9ClSVt6LUqPvX@cluster0.ll0oc.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    // by default will find all data in the collection
    const fetchedMeetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: fetchedMeetups.map(fetchedMeetup => ({
                title: fetchedMeetup.title,
                address: fetchedMeetup.address,
                image: fetchedMeetup.image,
                id: fetchedMeetup._id.toString()
            }))
        },
        revalidate: 1
    };
}

export default HomePage;