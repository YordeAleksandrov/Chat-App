//Upload Image in the file systems and returns the path 
export const handleImageChange = async (file) => {
      
    if (file) {
      console.log(file)
      const formData = new FormData();
      formData.append('file', file);
      console.log(file);
  
      try {
        const accessToken=sessionStorage.getItem('accessToken')
        const response = await fetch('http://localhost:3001/group/upload', {
          headers:{
            'Authorization': `Bearer ${accessToken}`
            },
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
         return data.filePath
        } else {
          console.error('Error uploading file:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };