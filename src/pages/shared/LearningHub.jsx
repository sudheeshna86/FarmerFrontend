import React, { useState } from "react";
import { BookOpen, Play, Award, Clock, CheckCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";

export default function LearningHub() {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: "1",
      title: "Sustainable Farming Practices",
      description:
        "Learn modern techniques to improve yield while protecting the environment",
      duration: 120,
      modules: 8,
      thumbnail:
        "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Beginner", "Sustainability", "Best Practices"],
      progress: 60,
      instructor: "Dr. Rajesh Kumar",
      rating: 4.8,
      enrolled: 1250,
    },
    {
      id: "2",
      title: "Organic Certification Process",
      description:
        "Step-by-step guide to obtaining organic certification for your farm",
      duration: 90,
      modules: 6,
      thumbnail:
        "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Intermediate", "Certification", "Organic"],
      progress: 0,
      instructor: "Priya Sharma",
      rating: 4.9,
      enrolled: 890,
    },
    {
      id: "3",
      title: "Modern Irrigation Techniques",
      description: "Efficient water management and advanced irrigation systems",
      duration: 75,
      modules: 5,
      thumbnail:
        "https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Intermediate", "Water Management", "Technology"],
      progress: 100,
      instructor: "Amit Patel",
      rating: 4.7,
      enrolled: 1450,
    },
    {
      id: "4",
      title: "Pest Management Without Chemicals",
      description:
        "Natural and biological pest control methods for healthier crops",
      duration: 60,
      modules: 4,
      thumbnail:
        "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Beginner", "Pest Control", "Organic"],
      progress: 25,
      instructor: "Dr. Meera Singh",
      rating: 4.6,
      enrolled: 780,
    },
    {
      id: "5",
      title: "Soil Health and Composting",
      description:
        "Building and maintaining healthy soil for better crop yields",
      duration: 85,
      modules: 6,
      thumbnail:
        "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Beginner", "Soil Science", "Composting"],
      progress: 0,
      instructor: "Kiran Reddy",
      rating: 4.8,
      enrolled: 1100,
    },
    {
      id: "6",
      title: "Digital Marketing for Farmers",
      description: "Promote your produce online and reach more buyers",
      duration: 45,
      modules: 4,
      thumbnail:
        "https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=400",
      tags: ["Beginner", "Marketing", "Business"],
      progress: 0,
      instructor: "Sanjay Gupta",
      rating: 4.5,
      enrolled: 650,
    },
  ];

  const handleOpenCourse = (course) => {
    setSelectedCourse(course);
    setCourseModalOpen(true);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="fw-bold fs-2 mb-2">Learning Courses</h1>
        <p className="text-muted">
          Expand your knowledge and improve your farming practices
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <Card hover className="text-center p-4">
            <div className="bg-success-subtle rounded-4 p-3 d-inline-flex mb-2">
              <BookOpen color="#198754" size={28} />
            </div>
            <h3 className="fw-bold mb-1">6</h3>
            <p className="text-muted mb-0">Courses Enrolled</p>
          </Card>
        </div>
        <div className="col-md-4">
          <Card hover className="text-center p-4">
            <div className="bg-primary-subtle rounded-4 p-3 d-inline-flex mb-2">
              <Award color="#0d6efd" size={28} />
            </div>
            <h3 className="fw-bold mb-1">3</h3>
            <p className="text-muted mb-0">Certificates Earned</p>
          </Card>
        </div>
        <div className="col-md-4">
          <Card hover className="text-center p-4">
            <div className="bg-warning-subtle rounded-4 p-3 d-inline-flex mb-2">
              <Clock color="#ffc107" size={28} />
            </div>
            <h3 className="fw-bold mb-1">12.5</h3>
            <p className="text-muted mb-0">Hours Learned</p>
          </Card>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 text-center">
        <Button variant="primary" className="me-2">
          All Courses
        </Button>
        <Button variant="outline" className="me-2">
          In Progress
        </Button>
        <Button variant="outline">Completed</Button>
      </div>

      {/* Course Cards */}
      <div className="row g-4">
        {courses.map((course) => (
          <div key={course.id} className="col-md-4">
            <Card hover onClick={() => handleOpenCourse(course)} className="h-100">
              <div className="position-relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="img-fluid rounded-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                {course.progress > 0 && (
                  <div
                    className="position-absolute bottom-0 start-0 w-100"
                    style={{ height: "5px", background: "#e9ecef" }}
                  >
                    <div
                      style={{
                        height: "5px",
                        width: `${course.progress}%`,
                        background: "#198754",
                      }}
                    />
                  </div>
                )}
                {course.progress === 100 && (
                  <div className="position-absolute top-0 end-0 m-2 bg-success rounded-circle p-2">
                    <CheckCircle color="white" size={22} />
                  </div>
                )}
              </div>

              <div className="p-3">
                <h5 className="fw-bold">{course.title}</h5>
                <p className="text-muted small">{course.description}</p>

                <div className="d-flex flex-wrap gap-1 mb-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>
                    <Clock size={14} className="me-1" />
                    {course.duration} min
                  </span>
                  <span>
                    <BookOpen size={14} className="me-1" />
                    {course.modules} modules
                  </span>
                  <span>⭐ {course.rating}</span>
                </div>

                <div className="text-secondary small mb-2">
                  By {course.instructor} • {course.enrolled} enrolled
                </div>

                {course.progress > 0 && course.progress < 100 && (
                  <Button size="sm" className="w-100">
                    Continue Learning ({course.progress}%)
                  </Button>
                )}
                {course.progress === 0 && (
                  <Button size="sm" variant="outline" className="w-100">
                    Start Course
                  </Button>
                )}
                {course.progress === 100 && (
                  <Button size="sm" variant="secondary" className="w-100">
                    <Award size={16} className="me-2" />
                    View Certificate
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        size="xl"
        title={selectedCourse?.title}
      >
        {selectedCourse && (
          <div className="p-2">
            <div className="bg-dark rounded mb-4 d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <Play color="white" size={60} />
            </div>
            <h5 className="fw-bold mb-2">About This Course</h5>
            <p className="text-muted">{selectedCourse.description}</p>
            <div className="row g-3 bg-light p-3 rounded mb-4">
              <div className="col">
                <div className="text-muted small">Duration</div>
                <div className="fw-semibold">{selectedCourse.duration} minutes</div>
              </div>
              <div className="col">
                <div className="text-muted small">Modules</div>
                <div className="fw-semibold">{selectedCourse.modules} lessons</div>
              </div>
              <div className="col">
                <div className="text-muted small">Level</div>
                <div className="fw-semibold">{selectedCourse.tags[0]}</div>
              </div>
            </div>

            <h6 className="fw-bold mb-2">Course Modules</h6>
            <div className="d-flex flex-column gap-2 mb-4">
              {Array.from({ length: selectedCourse.modules }, (_, i) => (
                <div key={i} className="p-2 bg-light rounded d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Module {i + 1}:</strong> Lesson Title
                  </div>
                  <small className="text-muted">15 min</small>
                </div>
              ))}
            </div>

            <Button className="w-100">
              {selectedCourse.progress === 0
                ? "Start Course"
                : "Continue Learning"}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
