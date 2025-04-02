// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// const AllUserPage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         // Fetch all users
//         const { data } = await axios.get("http://localhost:8080/api/users", {
//           withCredentials: true,
//         });

//         console.log("API Response:", data);

//         if (Array.isArray(data)) {
//           setUsers(data);
//         } else {
//           console.error("Expected an array but got:", data);
//           setError("Failed to load users. Invalid data format.");
//         }
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         toast.error("Error fetching users");
//         setError("Failed to load users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Safe check for users data
//   const safeUsers = Array.isArray(users) ? users : [];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6">
//             <div className="flex items-center">
//               <svg
//                 className="h-6 w-6 text-red-500 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                 />
//               </svg>
//               <p>
//                 <strong className="font-bold">Error!</strong> {error}
//               </p>
//             </div>
//             <button
//               className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
//               onClick={() => window.location.reload()}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
//             User Directory
//           </h1>
//           <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
//             Complete list of all registered users in the ClassSync system
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="border-b border-gray-200 bg-indigo-600 px-6 py-4">
//             <h2 className="text-xl font-semibold text-white">
//               All Users ({safeUsers.length})
//             </h2>
//           </div>

//           {safeUsers.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {safeUsers.map((user) => (
//                     <tr
//                       key={user.id}
//                       className="hover:bg-indigo-50 transition-colors duration-150"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {user.id}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-indigo-600 hover:text-indigo-900">
//                           {user.email}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="py-12 flex flex-col items-center justify-center bg-gray-50">
//               <svg
//                 className="h-16 w-16 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="1"
//                   d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                 />
//               </svg>
//               <p className="mt-4 text-xl font-medium text-gray-500">
//                 No users available
//               </p>
//               <p className="mt-2 text-gray-400">
//                 User data will appear here once registered in the system.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>
//             This data is refreshed automatically when users are added or updated
//             in the system.
//           </p>
//           <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllUserPage;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

const AllUserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users
        const { data } = await axios.get("http://localhost:8080/api/users", {
          withCredentials: true,
        });

        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Expected an array but got:", data);
          setError("Failed to load users. Invalid data format.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Error fetching users");
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Safe check for users data
  const safeUsers = Array.isArray(users) ? users : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-gray-800 border-l-4 border-pink-600 text-white p-6">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-pink-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>
                <strong className="font-bold">Error!</strong> {error}
              </p>
            </div>
            <button
              className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/30"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 text-transparent bg-clip-text mb-2">
            User Directory
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Complete list of all registered users in the Classync system
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-700 bg-gray-800 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              All Users ({safeUsers.length})
            </h2>
          </div>

          {safeUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {safeUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-purple-400 hover:text-pink-400 transition-colors">
                          {user.email}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center bg-gray-800/50">
              <svg
                className="h-16 w-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="mt-4 text-xl font-medium text-gray-300">
                No users available
              </p>
              <p className="mt-2 text-gray-400">
                User data will appear here once registered in the system.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            This data is refreshed automatically when users are added or updated
            in the system.
          </p>
          <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AllUserPage;
