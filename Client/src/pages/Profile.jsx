import { useParams } from 'react-router-dom';
import { UserProfile } from '../components/Profile/UserProfile';
export default function Profile() {

  const { ownerId} = useParams();
  return (
    <UserProfile ownerId={ownerId}/>
  )
}
