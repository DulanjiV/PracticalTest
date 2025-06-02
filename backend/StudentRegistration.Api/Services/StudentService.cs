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
            if (await _repository.EmailExistsAsync(createStudentDto.Email))
            {
                throw new Exception("Student email already exists.");
            }
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

            if (!string.IsNullOrEmpty(createStudentDto.ProfileImageBase64))
            {
                try
                {
                    student.ProfileImage = Convert.FromBase64String(createStudentDto.ProfileImageBase64);
                    student.ImageContentType = createStudentDto.ImageContentType;
                }
                catch (Exception ex)
                {
                    throw new Exception("Error processing image: " + ex.Message);
                }
            }

            return await _repository.CreateAsync(student);
        }

        public async Task<Student> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto)
        {
            var existingStudent = await _repository.GetByIdAsync(id);
            if (existingStudent == null)
            {
                throw new Exception("Student not found with the provided ID.");
            }
            if (await _repository.EmailExistsAsync(updateStudentDto.Email, id))
            {
                throw new Exception("Student email already exists.");
            }

            existingStudent.FirstName = updateStudentDto.FirstName;
            existingStudent.LastName = updateStudentDto.LastName;
            existingStudent.Mobile = updateStudentDto.Mobile;
            existingStudent.Email = updateStudentDto.Email;
            existingStudent.NIC = updateStudentDto.NIC;
            existingStudent.DateOfBirth = updateStudentDto.DateOfBirth;
            existingStudent.Address = updateStudentDto.Address;

            if (!string.IsNullOrEmpty(updateStudentDto.ProfileImageBase64))
            {
                try
                {
                    existingStudent.ProfileImage = Convert.FromBase64String(updateStudentDto.ProfileImageBase64);
                    existingStudent.ImageContentType = updateStudentDto.ImageContentType;
                }
                catch (Exception ex)
                {
                    throw new Exception("Error processing image: " + ex.Message);
                }
            }
            else if (updateStudentDto.ProfileImageBase64 == "" || updateStudentDto.ProfileImageBase64 == null)
            {
                existingStudent.ProfileImage = null;
                existingStudent.ImageContentType = null;
            }

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
