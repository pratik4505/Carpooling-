import { useParams } from 'react-router-dom';
export default function Profile() {

  const { ownerId} = useParams();
  return (
    <UserProfile ownerId={ownerId}/>
  )
}
