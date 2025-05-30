using StudentRegistration.Api.Models.Entities;

namespace StudentRegistration.Api.Data.Repositories
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Student>> GetAllAsync(); 
        Task<Student> GetByIdAsync(int id);
        Task<Student> CreateAsync(Student student);
        Task<Student> UpdateAsync(Student student);
        Task<bool> DeleteAsync(int id);
    }
}
