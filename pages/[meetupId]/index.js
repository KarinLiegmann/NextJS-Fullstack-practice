import { MongoClient, ObjectId } from 'mongodb';

import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
    return (
        <MeetupDetail
            image={props.meetupData.image}
            title={props.meetupData.title}
            address={props.meetupData.address}
            description={props.meetupData.description}
        />
    )
}

// useRouter-Hook can only be used in the component-function, not in the getstaticProps-function
// but you need to export the function getStaticPaths if you want to access params in getStaticProps
// fallback is a must and is a boolean or string 'blocking'
// if fallback: true, you will get a 404-error if accessing a page with a URL-parameter that doesn't exist
// if fallback: false, NextJS will create a page with URL-param

export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://karin:bVa9ClSVt6LUqPvX@cluster0.ll0oc.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    // find all meetups by using method 'find' with an empty object and only all ids by second parameter
    // _id: 1 tells it to only return the id, but no other field values
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup =>
        (
            {
                params:
                    { meetupId: meetup._id.toString() }
            }
        ))
    }
}

export async function getStaticProps(context) {

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(`${process.env.DB_KEY}`);
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            },
        }
    }

}

export default MeetupDetails;