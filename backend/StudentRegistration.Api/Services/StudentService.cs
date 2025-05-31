using StudentRegistration.Api.Data.Repositories;
using StudentRegistration.Api.Models.DTOs;
using StudentRegistration.Api.Models.Entities;
using StudentRegistration.Api.Models.Requests;

namespace StudentRegistration.Api.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResultDto<Student>> GetAllStudentsAsync(StudentSearchRequest request)
        {
            var (students, totalCount) = await _repository.GetAllAsync(request);

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new PagedResultDto<Student>
            {
                Data = students.ToList(),
                TotalRecords = totalCount,
                TotalPages = totalPages,
                CurrentPage = request.Page,
                PageSize = request.PageSize,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };
        }

        public async Task<Student> GetStudentByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Student> CreateStudentAsync(CreateStudentDto createStudentDto)
        {
            var student = new Student
            {
                FirstName = createStudentDto.FirstName,
                LastName = createStudentDto.LastName,
                Mobile = createStudentDto.Mobile,
                Email = createStudentDto.Email,
                NIC = createStudentDto.NIC,
                DateOfBirth = createStudentDto.DateOfBirth,
                Address = createStudentDto.Address,
            };

            return await _repository.CreateAsync(student);
        }

        public async Task<Student> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto)
        {
            var existingStudent = await _repository.GetByIdAsync(id);
            if (existingStudent == null)
            {
                return null;
            }

            existingStudent.FirstName = updateStudentDto.FirstName;
            existingStudent.LastName = updateStudentDto.LastName;
            existingStudent.Mobile = updateStudentDto.Mobile;
            existingStudent.Email = updateStudentDto.Email;
            existingStudent.NIC = updateStudentDto.NIC;
            existingStudent.DateOfBirth = updateStudentDto.DateOfBirth;
            existingStudent.Address = updateStudentDto.Address;

            return await _repository.UpdateAsync(existingStudent);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var existingStudent = await _repository.GetByIdAsync(id);
            if (existingStudent == null)
            {
                return false;
            }

            return await _repository.DeleteAsync(id);
        }
    }
}
